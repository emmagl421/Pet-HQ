import { useNavigate } from "react-router-dom";

export default function Documents() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "1rem" }}>
            <h1>About Page</h1>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
}