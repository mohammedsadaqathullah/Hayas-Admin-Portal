import { Link } from 'react-router-dom'

const Homepage = () => {
    return (
        <div style={
            {
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }
        }>
            <Link to='/Grocery' style={{ textDecoration: "none" }}>
                <div
                    style={{
                        width: "200px",
                        height: "25px",
                        padding: "10px",
                        backgroundColor: "black",
                        color: "white",
                        textAlign: "center",
                        alignSelf: "center"
                    }}
                >Grocery</div>
            </Link>
            <Link to='/Foods' style={{ textDecoration: "none" }}>
                <div
                    style={{
                        width: "200px",
                        height: "25px",
                        padding: "10px",
                        backgroundColor: "black",
                        color: "white",
                        textAlign: "center",
                        alignSelf: "center"
                    }}
                >Foods</div>
            </Link>
            <Link to='/VegetablesAndFruits' style={{ textDecoration: "none" }}>
                <div
                    style={{
                        width: "200px",
                        height: "25px",
                        padding: "10px",
                        backgroundColor: "black",
                        color: "white",
                        textAlign: "center",
                        alignSelf: "center"
                    }}
                >Vegetables And Fruits</div>
            </Link> 
            <Link to='/toyboxz' style={{ textDecoration: "none" }}>
                <div
                    style={{
                        width: "200px",
                        height: "25px",
                        padding: "10px",
                        backgroundColor: "black",
                        color: "white",
                        textAlign: "center",
                        alignSelf: "center"
                    }}
                >ToyBoxz</div>
            </Link>
             <Link to='/orderDashboard' style={{ textDecoration: "none" }}>
                <div
                    style={{
                        width: "200px",
                        height: "25px",
                        padding: "10px",
                        backgroundColor: "black",
                        color: "white",
                        textAlign: "center",
                        alignSelf: "center"
                    }}
                >Order Dashboard</div>
            </Link>
        </div>
    )
}

export default Homepage