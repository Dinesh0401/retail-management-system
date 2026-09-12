import { useState } from 'react'

function Products() {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState('electronics')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('')
  const [description, setDescription] = useState('')
  const [products, setProducts] = useState<any[]>([])

  return (
   <div className="products-page">
    <h1>Products</h1>
      <form
  className="product-form"
  onSubmit={(e) => {
    e.preventDefault()
    const newProduct = {
  name,
  sku,
  category,
  price,
  unit,
  description,
}

setProducts([...products, newProduct])
  }}
>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="grocery">Grocery</option>
          <option value="household">Household</option>
          <option value="other">Other</option>
        </select>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Product</button>
      </form>
      {products.map((product, index) => (
  <div key={index}>
    <h3>{product.name}</h3>
    <p>SKU: {product.sku}</p>
    <p>Category: {product.category}</p>
    <p>Price: ₹{product.price}</p>
    <p>Unit: {product.unit}</p>
    <p>{product.description}</p>
  </div>
))}
    </div>
  )
}

export default Products