import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_url } from "../../utils/ApiClient";
import Alert from "../../components/Alert";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    imageUrls: [""],
    variants: [
      {
        color: "",
        sizes: [{ name: "", quantity: "" }],
      },
    ],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData({ ...formData, imageUrls: newImageUrls });
  };

  const addImageUrl = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ""] });
  };

  const removeImageUrl = (index: number) => {
    const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: newImageUrls });
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSizeChange = (
    variantIndex: number,
    sizeIndex: number,
    field: string,
    value: any
  ) => {
    const newVariants = [...formData.variants];
    const newSizes = [...newVariants[variantIndex].sizes];
    newSizes[sizeIndex] = { ...newSizes[sizeIndex], [field]: value };
    newVariants[variantIndex].sizes = newSizes;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { color: "", sizes: [{ name: "", quantity: "" }] },
      ],
    });
  };

  const removeVariant = (index: number) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const addSize = (variantIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].sizes.push({ name: "", quantity: "" });
    setFormData({ ...formData, variants: newVariants });
  };

  const removeSize = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter(
      (_, i) => i !== sizeIndex
    );
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        imageUrls: formData.imageUrls.filter((url) => url.trim() !== ""),
        variants: formData.variants.map((variant) => ({
          color: variant.color,
          sizes: variant.sizes.map((size) => ({
            name: size.name,
            quantity: Number(size.quantity),
          })),
        })),
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${api_url}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Failed to add product");
      }

      setAlert({ type: "success", message: "Product added successfully!" });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setAlert({
        type: "error",
        message: error.message || "Failed to add product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="Hoodie">Hoodie</option>
                <option value="Pants">Pants</option>
                <option value="Suit">Suit</option>
                <option value="Crewneck">Crewneck</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs
            </label>
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formData.imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageUrl}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              + Add Image URL
            </button>
          </div>

          {/* Variants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variants
            </label>
            {formData.variants.map((variant, variantIndex) => (
              <div
                key={variantIndex}
                className="border border-gray-300 rounded-lg p-4 mb-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">
                    Variant {variantIndex + 1}
                  </h4>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(variantIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Variant
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    required
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(variantIndex, "color", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sizes
                  </label>
                  {variant.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className="flex gap-2 mb-2">
                      <select
                        required
                        value={size.name}
                        onChange={(e) =>
                          handleSizeChange(
                            variantIndex,
                            sizeIndex,
                            "name",
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Size</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                      <input
                        type="number"
                        required
                        placeholder="Quantity"
                        value={size.quantity}
                        onChange={(e) =>
                          handleSizeChange(
                            variantIndex,
                            sizeIndex,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {variant.sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSize(variantIndex, sizeIndex)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSize(variantIndex)}
                    className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    + Add Size
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              + Add Variant
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
