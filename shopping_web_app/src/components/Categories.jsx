const Categories = () => {
  const categories = ["Electronics", "Fashion", "Grocery", "Mobiles"];

  return (
    <section className="categories">
      {categories.map((cat) => (
        <div key={cat} className="category-card">
          {cat}
        </div>
      ))}
    </section>
  );
};

export default Categories;
