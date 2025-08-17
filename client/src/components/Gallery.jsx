function Gallery() {
  return (
    <section className="card gallery-preview">
      <h2>Gallery</h2>
      <div className="gallery-thumb-wrap">
        <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="Gallery Preview" className="gallery-thumb" />
        <a href="#" className="gallery-link">View Gallery</a>
      </div>
    </section>
  );
}

export default Gallery;
