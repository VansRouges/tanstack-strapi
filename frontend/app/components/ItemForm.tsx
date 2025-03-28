import { useForm } from "@tanstack/react-form";
import * as React from "react";

function FieldInfo({ field }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default function ItemForm({ onClose, onItemAdded }) {
  const form = useForm({
    defaultValues: {
      productID: 1,
      productName: "",
      quantity: 1,
      price: 1,
      category: "",
      supplier: "",
      productImage: null as File | null, // Added image field
    },
    onSubmit: async ({ value }) => {
      try {
        // Step 1: Create the inventory entry
        const { productImage, ...formData } = value; // Exclude image from first request
        const payload = { data: formData };

        const entryResponse = await fetch("http://localhost:1337/api/inventories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!entryResponse.ok) throw new Error("Failed to create entry");

        const entryData = await entryResponse.json();
        console.log("Entry created:", entryData);
        const documentId = entryData.data.documentId;

        // Step 2: Upload the image
        const formDataImage = new FormData();
        if (productImage) {
          formDataImage.append("files", productImage); // Append selected file
        }

        const imageResponse = await fetch("http://localhost:1337/api/upload", {
          method: "POST",
          body: formDataImage,
        });

        if (!imageResponse.ok) throw new Error("Failed to upload image");

        const uploadedImage = await imageResponse.json();
        console.log("Image uploaded:", uploadedImage);
        const imageId = uploadedImage[0].id;

        // Step 3: Perform PUT request to update entry with image ID
        const updatePayload = {
          data: { productImage: imageId },
        };

        const updateResponse = await fetch(`http://localhost:1337/api/inventories/${documentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });

        if (!updateResponse.ok) throw new Error("Failed to update entry with image");
        console.log("Entry updated with image", updateResponse);

        onItemAdded(entryData.data.attributes || entryData.data);
        alert("Item added successfully with image!");
        window.location.reload(); // Reload page to show new item
      } catch (error) {
        console.error("Error during item creation:", error);
        alert("Error adding item.");
      }
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Product ID */}
        <form.Field
          name="productID"
          validators={{
            onChange: ({ value }) =>
              !value || value <= 0 ? "Product ID must be greater than 0" : undefined,
          }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Product ID</label>
              <input
                id={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              <FieldInfo field={field} />
            </>
          )}
        />

        {/* Product Name */}
        <form.Field
          name="productName"
          validators={{
            onChange: ({ value }) =>
              !value ? "Product name is required" : value.length < 3 ? "Must be at least 3 characters" : undefined,
          }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Product Name</label>
              <input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
              <FieldInfo field={field} />
            </>
          )}
        />

        {/* Quantity */}
        <form.Field
          name="quantity"
          validators={{
            onChange: ({ value }) => (value <= 0 ? "Quantity must be at least 1" : undefined),
          }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Quantity</label>
              <input
                id={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              <FieldInfo field={field} />
            </>
          )}
        />

        {/* Price */}
        <form.Field
          name="price"
          validators={{
            onChange: ({ value }) => (value <= 0 ? "Price must be greater than 0" : undefined),
          }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Price</label>
              <input
                id={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              <FieldInfo field={field} />
            </>
          )}
        />

        {/* Category */}
        <form.Field
          name="category"
          validators={{
            onChange: ({ value }) => (!value ? "Category is required" : undefined),
          }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Category</label>
              <input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
              <FieldInfo field={field} />
            </>
          )}
        />

        {/* Supplier */}
        <form.Field
          name="supplier"
          validators={{
            onChange: ({ value }) => (!value ? "Supplier is required" : undefined),
          }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Supplier</label>
              <input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
              <FieldInfo field={field} />
            </>
          )}
        />

        {/* Image Upload */}
        <form.Field
          name="productImage"
          validators={{
            onChange: ({ value }) => (!value ? "Image is required" : undefined),
          }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Product Image</label>
              <input
                id={field.name}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  field.handleChange(() => file);
                }}
              />
              <FieldInfo field={field} />
            </>
          )}
        />

        {/* Buttons */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </button>
              <button type="reset" onClick={() => form.reset()}>
                Reset
              </button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </>
          )}
        />
      </form>
    </div>
  );
}
