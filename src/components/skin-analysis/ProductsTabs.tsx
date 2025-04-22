
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  link: string;
}

export const ProductsTabs = ({
  recommendations,
}: {
  recommendations: Product[];
}) => (
  <Card>
    <CardContent className="p-4 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Recommended Products
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((product) => (
          <div 
            key={product.id}
            className="flex border border-gray-200 rounded-md overflow-hidden bg-white"
          >
            <div className="w-24 h-24 flex-shrink-0">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-3">
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-900">
                  {product.price}
                </span>
                <a 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-skin-purple hover:text-skin-purple/90"
                >
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  View Product
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-500 mt-4">
        <p>
          Products are recommended based on your skin analysis. Individual results may vary.
        </p>
      </div>
    </CardContent>
  </Card>
);
