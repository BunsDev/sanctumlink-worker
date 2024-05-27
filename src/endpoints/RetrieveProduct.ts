import {
  Int,
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";

export class RetrieveProduct extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Product"],
    summary: "Get product details",
    parameters: {
      uid: Path(Int, {
        description: "The ID of the product",
      }),
    },
    responses: {
      "200": {
        description: "Returns the product",
        schema: {
          id: Number,
          price: Number,
          description: String,
          img: String,
          stock: Number,
        },
      },
      "404": {
        description: "Product not found",
        schema: {
          message: String,
        }
      }
    },
  };

  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    const { uid: productId } = data.params;
    // console.log({ productId });

    const products = [
      { id: 1, name: 'Television', price: 99.99, description: 'Sony Television', img: 'imp1.png', stock: 10 },
      { id: 2, name: 'Wireless Speakers', price: 79.99, description: 'Sony Wireless Speakers for good sound', img: 'imp2.png', stock: 5 },
      { id: 3, name: 'Camera ', price: 59.99, description: 'Sony camera for clear pictures', img: 'imp3.png', stock: 8 },
    ]

    const product = products.find((p:any) => p.id === productId);

    if(!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    return {
      id: product.id,
      price: product.price,
      description: product.description,
      img: product.img,
      stock: product.stock,
    };
  }
}
