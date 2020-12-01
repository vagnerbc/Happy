import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Map, Marker, TileLayer } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { FiX, FiPlus } from "react-icons/fi";

import useLocation from "../hooks/useLocation";
import api from "../services/api";

import mapIcon from "../utils/mapIcon";
import Sidebar from "../components/Sidebar";
import CreateModal from "../components/CreateModal";

import "../styles/pages/create-orphanage.css";

export default function CreateOrphanage() {
  const { id } = useParams() as { id: string };

  const [created, setCreated] = useState(false);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [instructions, setInstructions] = useState("");
  const [opening_hours, setOpeningHours] = useState("");
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const { latitude, longitude, setLatitude, setLongitude } = useLocation();

  useEffect(() => {
    if (!id) return;

    const getOrphanage = async () => {
      const { data } = await api.get(`orphanages/${id}`);
      console.log(data);
      setName(data.name);
      setAbout(data.about);
      setInstructions(data.instructions);
      setOpeningHours(data.opening_hours);
      setOpenOnWeekends(data.open_on_weekends);

      const imagesFiles: File[] = await Promise.all(
        data.images.map(async (image: { id: string; url: string }) => {
          const response = await fetch(image.url);
          return await response.blob();
        })
      );

      setImages(imagesFiles);
      setPreviewImages(
        data.images.map((image: { id: string; url: string }) => image.url)
      );
      setLatitude(data.latitude);
      setLongitude(data.longitude);
      setPosition({ latitude: data.latitude, longitude: data.longitude });
    };

    getOrphanage();
  }, [id, setLatitude, setLongitude]);

  const handleMapClick = (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;

    setPosition({ latitude: lat, longitude: lng });
  };

  const handleSelectImages = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedImages = Array.from(event.target.files);

    setImages([...images].concat(selectedImages));

    const selectedImagesPreview = selectedImages.map((image) => {
      return URL.createObjectURL(image);
    });

    setPreviewImages([...previewImages].concat(selectedImagesPreview));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();
    data.append("id", id);
    data.append("name", name);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("about", about);
    data.append("instructions", instructions);
    data.append("opening_hours", opening_hours);
    data.append("open_on_weekends", String(open_on_weekends));

    images.forEach((image) => {
      data.append("images", image);
    });

    if (!id) {
      await api.post("orphanages", data);
    } else {
      await api.put(`orphanages/${id}`, data);
    }

    setCreated(true);
  };

  const handleRemoveImage = (index: number) => {
    const imageCopy = [...images];
    imageCopy.splice(index, 1);
    setImages(imageCopy);

    const previewCopy = [...previewImages];
    previewCopy.splice(index, 1);
    setPreviewImages(previewCopy);
  };

  return created ? (
    <CreateModal name={name} />
  ) : (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[latitude, longitude]}
              style={{ width: "100%", height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={(event) => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image, index) => {
                  return (
                    <div className="img-content" key={image}>
                      <button
                        type="button"
                        className="remove"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <FiX width="24" height="24" />
                      </button>
                      <img src={image} alt={name} />;
                    </div>
                  );
                })}

                <label className="new-image" htmlFor="image[]">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input
                type="file"
                multiple
                id="image[]"
                onChange={handleSelectImages}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={(event) => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
