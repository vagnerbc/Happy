import React, { useCallback, useEffect, useState } from "react";
import { FiEdit3, FiTrash, FiCheck, FiX } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useHistory } from "react-router-dom";

import api from "../services/api";
import AsideDashboard from "../components/AsideDashboard";
import Empty from "../components/Empty";
import mapIcon from "../utils/mapIcon";
import "../styles/pages/dashboard.css";
import DeleteModal from "../components/DeleteModal";

interface Orphanage {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

function Dashboard() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [approved, setApproved] = useState(true);
  const [orphanageToDelete, setOrphanageToDelete] = useState<Orphanage | null>(
    null
  );

  const history = useHistory();

  const getApproveds = async () => {
    const { data } = await api.get("/dashboard/approved");
    setOrphanages(data);
    setApproved(true);
  };

  const getPendings = async () => {
    const { data } = await api.get("/dashboard/pending");
    setOrphanages(data);
    setApproved(false);
  };

  const handlePending = useCallback(async () => {
    getPendings();
  }, []);

  const handleApproved = useCallback(async () => {
    getApproveds();
  }, []);

  useEffect(() => {
    getApproveds();
  }, []);

  const removeOrphanage = useCallback(
    (id: string) => {
      const index = orphanages.findIndex((value) => value.id === id);
      const copy = [...orphanages];
      copy.splice(index, 1);
      setOrphanages(copy);
    },
    [orphanages]
  );

  const handleApprove = useCallback(
    async (id: string) => {
      await api.put(`/orphanages/approve/${id}`);

      removeOrphanage(id);
    },
    [removeOrphanage]
  );

  const handleReject = useCallback(
    async (id: string) => {
      await api.put(`/orphanages/reject/${id}`);

      removeOrphanage(id);
    },
    [removeOrphanage]
  );

  const handleEdit = (id: string) => {
    history.push(`orphanages-update/${id}`);
  };

  const handleDelete = useCallback(async (orphanage) => {
    setOrphanageToDelete(orphanage);
  }, []);

  const handleModalDelete = useCallback(async () => {
    try {
      if (!orphanageToDelete) return;

      await api.delete(`/orphanages/delete/${orphanageToDelete.id}`);

      removeOrphanage(orphanageToDelete.id);
    } finally {
      setOrphanageToDelete(null);
    }
  }, [orphanageToDelete, removeOrphanage]);

  const handleModalCancel = useCallback(async () => {
    setOrphanageToDelete(null);
  }, []);

  return (
    <>
      <div id="page-dashboard">
        <AsideDashboard
          approved={approved}
          handleApproved={handleApproved}
          handlePending={handlePending}
        />
        <div className="main">
          <div className="header">
            <h2>
              {approved ? "Orfanatos cadastrados" : "Orfanatos pendentes"}
            </h2>
            <span>{`${orphanages.length} orfanatos`}</span>
          </div>

          <div className="devider"></div>

          {orphanages.length <= 0 && <Empty />}

          <div className="container">
            {orphanages.map((orphanage, index) => (
              <div key={index} className="card">
                <div className="map">
                  <Map
                    center={[orphanage.latitude, orphanage.longitude]}
                    zoom={16}
                    style={{ width: "100%", borderRadius: "20px" }}
                    dragging={false}
                    touchZoom={false}
                    zoomControl={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                  >
                    <TileLayer
                      url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                    />

                    <Marker
                      interactive={false}
                      icon={mapIcon}
                      position={[orphanage.latitude, orphanage.longitude]}
                    />
                  </Map>
                </div>
                <div className="footer">
                  <span>{orphanage.name}</span>
                  <div className="buttons">
                    {approved ? (
                      <>
                        <button
                          title="editar"
                          onClick={() => handleEdit(orphanage.id)}
                        >
                          <FiEdit3 width={48} height={48} />
                        </button>
                        <button
                          title="Excluir"
                          onClick={() => handleDelete(orphanage)}
                        >
                          <FiTrash width={48} height={48} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="reject"
                          title="Rejeitar"
                          onClick={() => handleReject(orphanage.id)}
                        >
                          <FiX width={48} height={48} />
                        </button>
                        <button
                          className="approve"
                          title="Aprovar"
                          onClick={() => handleApprove(orphanage.id)}
                        >
                          <FiCheck width={48} height={48} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {orphanageToDelete && (
        <DeleteModal
          orphanage={orphanageToDelete}
          handleCancel={handleModalCancel}
          handleDelete={handleModalDelete}
        />
      )}
    </>
  );
}

export default Dashboard;
