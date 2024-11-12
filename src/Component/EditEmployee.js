import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button, Row,Col } from "reactstrap";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch(`https://66daa02cf47a05d55be5585f.mockapi.io/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setTitle(data.title);
        setDescription(data.description);
        console.log(data, "dta----------");
      })
      .catch((error) => {
        console.log("Error fetching data ", error);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editUser = {
      id: id,
      title: title,
      description: description,
    };
    try {
      const response = await fetch(
        `https://66daa02cf47a05d55be5585f.mockapi.io/user/${id}`,
        {
          method: "PUT",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(editUser),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      navigate("/");
    } catch (error) {
      console.log("Error updating user", error);
    }
  };

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"100px"}}>
      <Form onSubmit={handleSubmit}>
        <Row>
         <Col >
        <FormGroup>
          <Label for="exampleTitle">Title</Label>
          <Input
            id="exampleTitle"
            name="title"
            placeholder="Enter Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
        </FormGroup>
            </Col>
            </Row>
            <Row>
             <Col >
        <FormGroup>
          <Label for="exampleDescription">Description</Label>
          <Input
            id="exampleDescription"
            name="description"
            placeholder="Enter Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </FormGroup>
            </Col>   
           </Row>
        <Button
          type="submit"
          style={{
            color: "white",
            backgroundColor: "blue",
            border: "none",
            borderRadius: "10px",
          }}
        >
          Update
        </Button>

        <Button
          type="button"
          onClick={() => navigate("/")}
          style={{
            marginLeft: "10px",
            color: "white",
            backgroundColor: "gray",
            border: "none",
            borderRadius: "10px",
          }}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default Edit;
