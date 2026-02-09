import { Restaurant } from "@/types";
import { Link } from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio";
import { Banknote, Clock, Dot } from "lucide-react";

type Props = {
  restaurant: Restaurant;
};

const SearchResultCard = ({ restaurant }: Props) => {
  return (
    <Link
      to={`/details/${restaurant._id}`}
      className="grid lg:grid-cols-[3fr_2fr] gap-5 group"
    >
      <div>
        <h3 className="text-sm font-normal tracking-tight mb-2 group-hover:text-gray-400">
          {restaurant.restaurantName}
        </h3>
        <div id="card-content" className="grid md:grid-cols-1 gap-2">
          <div className="flex flex-row flex-wrap">
            {restaurant.cuisines.map((item, index) => (
              <span className="flex" key={index}>
                <span>{item}</span>
                {index < restaurant.cuisines.length && <Dot />}
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-col">
            <div className="flex items-center gap-1 text-red-600">
              <Clock className="text-green-600" />
              {restaurant.estimatedDeliveryTime} hours
            </div>
            <div className="flex items-center gap-1">
              <Banknote />
              Delivery from £{(restaurant.deliveryPrice * 100).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <AspectRatio ratio={16 / 9}>
        <img
          src={restaurant.imageUrl}
          className="rounded-md w-full h-full object-contain"
        />
      </AspectRatio>
    </Link>
  );
};

export default SearchResultCard;
