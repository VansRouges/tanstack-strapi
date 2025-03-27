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
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = { data: value }; // Wrap in "data" object

        const response = await fetch("http://localhost:1337/api/inventories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to add item");

        const newItem = await response.json();
        onItemAdded(newItem.data.attributes || newItem.data);
        alert("Item added successfully!");
      } catch (error) {
        console.error("Error creating entry", error);
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
