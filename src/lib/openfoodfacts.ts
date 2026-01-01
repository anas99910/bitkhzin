export interface OFFProduct {
    name: string;
    image?: string;
    brand?: string;
    category?: string;
}

export async function fetchProduct(barcode: string): Promise<OFFProduct | null> {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.status === 1 && data.product) {
            const p = data.product;
            return {
                name: p.product_name || p.product_name_en || p.product_name_fr || 'Unknown Product',
                image: p.image_url,
                brand: p.brands,
                category: p.categories_tags?.[0]?.replace('en:', '').replace(/-/g, ' ') || undefined
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
