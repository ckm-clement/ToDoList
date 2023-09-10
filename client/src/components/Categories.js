// Define functional component ListItem that takes a single prop named task
const Categories= ({setSelectedCategory, selectedCategory}) => {
  


    return (

        <div className="category-filter">
        <label>
          <input
            type="radio"
            name="category"
            value="all"
            checked={selectedCategory === 'all'}
            onChange={() => setSelectedCategory('all')}
          />
          All
        </label>
        <label>
          <input
            type="radio"
            name="category"
            value="work"
            checked={selectedCategory === 'work'}
            onChange={() => setSelectedCategory('work')}
          />
          Work
        </label>
        <label>
          <input
            type="radio"
            name="category"
            value="personal"
            checked={selectedCategory === 'personal'}
            onChange={() => setSelectedCategory('personal')}
          />
          Personal
        </label>
    </div>
    );
  }
  
  export default Categories;
  