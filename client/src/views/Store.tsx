import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Define interfaces for our data types
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface User {
  displayName: string;
  xp: number;
}

interface AuthContextType {
  currentUser?: User;
  isAuthenticated?: boolean;
  logout?: () => void;
}

const Store: React.FC = () => {
  const authContext: AuthContextType = useAuth();
  const currentUser = authContext?.currentUser || { displayName: "Student", xp: 5000 };
  const [cart, setCart] = useState<Product[]>([]);
  const [remainingXp, setRemainingXp] = useState<number>(currentUser.xp);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Google Cloud Credits",
      description: "Get $50 worth of Google Cloud credits for your projects",
      price: 500,
      image: "https://picsum.photos/200/300"
    },
    {
      id: 2,
      name: "Udemy Course Coupon",
      description: "100% off coupon for any Udemy course of your choice",
      price: 300,
      image: "https://picsum.photos/200/300"
    },
    {
      id: 3,
      name: "Xbox Game Pass (1 Month)",
      description: "Access to hundreds of high-quality games for one month",
      price: 800,
      image: "https://picsum.photos/200/300"
    },
    {
      id: 4,
      name: "College Branded T-Shirt",
      description: "Premium quality T-shirt with college logo",
      price: 450,
      image: "https://picsum.photos/200/300"
    },
    {
      id: 5,
      name: "Programming Books Bundle",
      description: "Digital bundle of 5 bestselling programming books",
      price: 600,
      image: "https://picsum.photos/200/300"
    },
    {
      id: 6,
      name: "Skill Forge Merch",
      description: "Warm and comfortable hoodie with college branding",
      price: 750,
      image: "https://picsum.photos/200/300"
    }
  ]);

  const addToCart = (product: Product): void => {
    if (remainingXp >= product.price) {
      setCart([...cart, product]);
      setRemainingXp(remainingXp - product.price);
    } else {
      alert("Not enough XP points to add this item!");
    }
  };

  const removeFromCart = (productId: number): void => {
    const itemToRemove = cart.find(item => item.id === productId);
    if (itemToRemove) {
      setRemainingXp(remainingXp + itemToRemove.price);
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  const calculateTotal = (): number => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = (): void => {
    if (cart.length > 0) {
      alert("Items redeemed successfully!");
      setCart([]);
    }
  };

  // Reset remaining XP when currentUser changes
  useEffect(() => {
    setRemainingXp(currentUser.xp);
  }, [currentUser.xp]);

  return (
    <div className="container mx-auto py-8 pt-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Welcome to the Rewards Store, {currentUser.displayName}!</h1>
          <p className="text-lg text-gray-600">Redeem your hard-earned XP points for exciting rewards</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-primary/20 dark:bg-primary/30 p-4 rounded-lg shadow-sm border border-primary/30"
        >
          <div className="flex items-center">
            <span className="text-lg font-medium mr-2">Your XP Balance:</span> 
            <Badge variant="secondary" className="px-3 py-1 text-lg bg-primary/90 text-primary-foreground hover:bg-primary/90">
              {remainingXp} XP
            </Badge>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div 
          className="w-full lg:w-2/3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full overflow-hidden">
                  <div className="w-full h-40 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <Badge variant="outline" className="px-3 py-1">
                      {product.price} XP
                    </Badge>
                    <Button
                      variant={remainingXp < product.price ? "outline" : "default"}
                      onClick={() => addToCart(product)}
                      disabled={remainingXp < product.price}
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="w-full lg:w-1/3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Your Cart</CardTitle>
              {cart.length > 0 && (
                <CardDescription>
                  You'll spend {calculateTotal()} XP
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.price} XP</div>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        {index < cart.length - 1 && <Separator />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ScrollArea>
              )}
              {cart.length > 0 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t font-bold">
                  <span>Total:</span>
                  <span>{calculateTotal()} XP</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={cart.length === 0}
                onClick={handleCheckout}
                variant="default"
              >
                Redeem Rewards
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Store;
