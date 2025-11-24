import { Star } from "lucide-react"; // facultatif, mais très pratique

function Stars({ percent }: { percent: number }) {
  const totalStars = 5;

  // Chaque étoile = 20%
  const fullStars = Math.round((percent / 100) * totalStars);

  return (
    <div className="flex justify-center space-x-1">
      {Array.from({ length: totalStars }).map((_, i) => (
        <Star
          key={i}
          className={
            i < fullStars ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
          }
        />
      ))}
    </div>
  );
}
export default Stars;
