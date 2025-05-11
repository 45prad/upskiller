import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY,);

async function createTokenProducts() {
  const products = [
    { name: '50 Tokens', tokens: 50, price: 4.99, bonus: 0 },
    { name: '100 Tokens', tokens: 100, price: 9.99, bonus: 10 },
    { name: '250 Tokens', tokens: 250, price: 19.99, bonus: 50 },
    { name: '500 Tokens', tokens: 500, price: 34.99, bonus: 100 },
    { name: '1000 Tokens', tokens: 1000, price: 59.99, bonus: 250 },
  ];

  const createdProducts = [];

  for (const product of products) {
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: `${product.tokens} tokens with ${product.bonus} bonus`,
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100), // amount in cents
      currency: 'usd',
    });

    createdProducts.push({
      ...product,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });
  }

  console.log('Created products:');
  console.log(createdProducts);
  return createdProducts;
}

createTokenProducts().catch(console.error);