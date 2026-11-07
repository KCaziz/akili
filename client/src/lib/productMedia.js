// Les biens créés avant l'ajout des médias multiples n'ont que le champ `image`.
export function getProductPhotos(product) {
  const photos = (product.media || []).filter((item) => item.type === "PHOTO");
  if (photos.length > 0) return photos;
  return product.image ? [{ url: product.image }] : [];
}

export function getProductVideos(product) {
  return (product.media || []).filter((item) => item.type === "VIDEO");
}
