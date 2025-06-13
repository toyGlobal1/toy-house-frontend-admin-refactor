import { AddProductForm } from "../../components/product/AddProductForm";

export const AddProductPage = () => {
  return (
    <div className="p-4">
      <h1 className="mb-3 text-center text-xl font-bold">Add Product</h1>
      <AddProductForm />
    </div>
  );
};

export default AddProductPage;
