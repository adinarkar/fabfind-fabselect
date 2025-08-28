import { ImageCard } from "../reuse/CategoryTabs";


export default function MenAcc() {
  const cardData = [
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "MEN'S BELT COLLECTION",
      text: "BEST OF MENS BY MENS",
      lastUpdated: "",
      routeTo: "/men-belt",
    },
    {
      img: "https://picsum.photos/id/1016/1000/400",
      title: "MEN'S WALLET COLLECTION",
      text: "SELECTED FASHION FINDS",
      lastUpdated: "",
      routeTo: "/men-wallet",
    },
    
  ];

  return (
    <div>
      <h1>ACCESSORIES</h1>
        <div className="container my-4">
      <div className="row g-3">
        {cardData.map((card, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <ImageCard {...card} />
          </div>
        ))}
      </div>
    </div>

    </div>
  )
}
