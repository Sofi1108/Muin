import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

  return (
    <div className="categories">
      <div>
        <img src="" alt="" />
        <span>SHIRTS</span>
      </div>
      <div>
        <img src="" alt="" />
        <span>HOODIES</span>
      </div>
      <div>
        <img src="" alt="" />
        <span>ACCESORIES</span>
      </div>
      <div>
        <img src="" alt="" />
        <span>SALES</span>
      </div>
    </div>
  );
}

export default Categories;
