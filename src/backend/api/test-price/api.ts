import { products } from '@wix/stores';

// Test endpoint to manually update a product price
export async function GET(req: Request) {
  try {
    // Get the product ID from the URL
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');
    
    if (!productId) {
      return new Response('Missing productId parameter', { status: 400 });
    }
    
    console.log(`Attempting to update price for product: ${productId}`);
    
    // Get the current product
    const response = await products.getProduct(productId);
    
    if (!response.product) {
      return new Response(`Product not found: ${productId}`, { status: 404 });
    }
    
    // Get the current price and add $1
    const currentPrice = Number(response.product.price?.price || 0);
    const newPrice = currentPrice + 1;
    
    // Update the product with the new price
    await products.updateProduct(productId, {
      price: {
        price: Number(newPrice),
        formatted: {
          price: `$${newPrice.toFixed(2)}`
        }
      }
    });
    
    console.log(`Successfully updated price for product ${productId} from $${currentPrice.toFixed(2)} to $${newPrice.toFixed(2)}`);
    
    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: `Price updated for product ${productId} from $${currentPrice.toFixed(2)} to $${newPrice.toFixed(2)}`,
      newPrice
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error updating price:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 