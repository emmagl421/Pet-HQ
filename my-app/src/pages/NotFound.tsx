import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div style={{ padding: "1rem" }}>
        <h1>404 - Page Not Found</h1>
        <Link to="/">Back to Home</Link>
    </div>
    );
}