import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import qs from "qs";
import axios from "redaxios";

import { getStrapiURL } from "./strapi";

const BASE_API_URL = getStrapiURL();

interface StrapiArrayResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiResponse<T> {
  data: T;
}

interface ProductImage {
  url: string;
  alternativeText: string;
}

export type InventoryType = {
  id: number;
  productID: string;
  productName: string;
  quantity: number;
  price: number;
  category: string;
  supplier: string;
  productImage: ProductImage;
  productDetails: string;
};

// Fetch a single inventory item by ID
export const fetchInventoryItem = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    console.info(`Fetching inventory item with id ${data}...`);

    const path = "/api/inventories/" + data;
    const url = new URL(path, BASE_API_URL);

    url.search = qs.stringify({
      populate: {
        productImage: {
          fields: ["url", "alternativeText"],
        },
      },
    });

    const inventoryItem = await axios
      .get<StrapiResponse<InventoryType>>(url.href)
      .then((r) => r.data.data)
      .catch((err) => {
        console.error(err);
        if (err.status === 404) {
          throw notFound();
        }
        throw err;
      });

    return inventoryItem;
  });


// Fetch all inventory items
export const fetchInventories = createServerFn({ method: "GET" }).handler(
  async () => {
    console.info("Fetching inventory items...");

    const path = "/api/inventories";
    const url = new URL(path, BASE_API_URL);

    url.search = qs.stringify({
      populate: {
        productImage: {
          fields: ["url", "alternativeText"],
        },
      },
    });

    return axios.get<StrapiArrayResponse<InventoryType>>(url.href).then((r) => {
      console.dir(r.data, { depth: null });
      return r.data.data;
    });
  }
);