import { ImageCard } from "../reuse/CategoryTabs"
import Mens from "./Mens";

export default function Home() {
  const cardsData = [
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "MEN'S COLLECTION",
      text: "BEST OF MENS BY MENS",
      lastUpdated: "",
      routeTo: "/mens",
    },
    {
      img: "https://picsum.photos/id/1016/1000/400",
      title: "WOMEN'S COLLECTION",
      text: "SELECTED FASHION FINDS",
      lastUpdated: "",
      routeTo: "/womens",
    },
    {
      img: "https://picsum.photos/id/1018/1000/400",
      title: "KIDS",
      text: "EXPERIENCE MAGICAL WORLD.",
      lastUpdated: "",
      routeTo: "/kids",
    },
    {
      img: "https://picsum.photos/id/1020/1000/400",
      title: "Wilderness",
      text: "Go off the grid and find yourself in the wild.",
      lastUpdated: "",
      routeTo: "/about",
    },
  ];

  return (
    <div>
      <h1>Categories</h1>
        <div className="container my-4">
      <div className="row g-3">
        {cardsData.map((card, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <ImageCard {...card} />
          </div>
        ))}
      </div>
    </div>

    </div>
  )
}
