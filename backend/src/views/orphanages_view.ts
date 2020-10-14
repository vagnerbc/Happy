import Orphanate from "../models/Orphanage";
import ImagesView from "../views/images_view";

export default {
  render(orphanate: Orphanate) {
    return {
      id: orphanate.id,
      name: orphanate.name,
      latitude: orphanate.latitude,
      longitude: orphanate.longitude,
      about: orphanate.about,
      instructions: orphanate.instructions,
      opening_hours: orphanate.opening_hours,
      open_on_weekends: orphanate.open_on_weekends,
      images: ImagesView.renderMany(orphanate.images),
    };
  },

  renderMany(orphanates: Orphanate[]) {
    return orphanates.map((orphanate) => this.render(orphanate));
  },
};
