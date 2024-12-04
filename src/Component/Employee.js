import { useState, useEffect } from "react";
import { Table, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Crude.module.css";

const Crude = () => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("https://66daa02cf47a05d55be5585f.mockapi.io/user")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://66daa02cf47a05d55be5585f.mockapi.io/user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(response, "responses");

      if (response.ok) {
        setRefresh((prev) => !prev);
      } else {
        console.error("Failed to delete the item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const formNavigate = () => {
    navigate("/add");
  };

  return (
    <>
      <div className={styles.tableContainer}>
        <Button
          className={styles.button}
          color="primary"
          outline
          onClick={formNavigate}
        >
          AddUser
        </Button>
        <Table bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={user.id}>
                <th scope="row">{index + 1}</th>
                <td>{user.title}</td>
                {/* <td>{user.description}</td> */}
                <td>
                  <div
                    dangerouslySetInnerHTML={{ __html: user.description }}
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                </td>

                <td>
                  <Link to={`/edit/${user.id}`}>
                    <Button
                      color="primary"
                      size="sm"
                      style={{
                        background: "gray",
                        color: "white",
                        width: "50px",
                      }}
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(user.id)}
                    color="primary"
                    size="sm"
                    style={{
                      background: "red",
                      color: "white",
                      margin: "10px",
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default Crude;
