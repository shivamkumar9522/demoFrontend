import { useEffect, useState ,useMemo} from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, FormGroup, Input, Label, Button } from "reactstrap";
import YooptaEditor, { createYooptaEditor } from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";
import Blockquote from "@yoopta/blockquote";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];
const CustomHeadingOne = HeadingOne.extend({
  renders: {
    "heading-one": (props) => (
      <h1 className={props.HTMLAttributes.className}>{props.children}</h1>
    ),
  },
  options: {
    shortcuts: ["h1", "#", "*"],
    align: "left", 
    display: {
      title: "Heading 1",
      description: "Big section heading",
    },
    HTMLAttributes: {
      className: "custom-heading-one",
    },
  },
});

const plugins = [
  Paragraph,
  Blockquote,
  NumberedList,
  BulletedList,
  TodoList,
  CustomHeadingOne,
  HeadingTwo,
  HeadingThree,
];


const AddForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [title, setTitle] = useState(" ");
  const [description, setDescription] = useState(" ");
  const [error, setError] = useState("");
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState();

  const onChange = (valuesss) => {
    setValue(valuesss);
  };
  useEffect(() => {}, []);
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("please fill all fields");
      return;
    }

    setError("");
    const newUser = {
      title: title,
      description: description,
    };
    try {
      const res = await fetch(
        "https://66daa02cf47a05d55be5585f.mockapi.io/user",
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );
      console.log("res", res);
      navigate("/");
    } catch (error) {
      console.log("error saving data:", error);
    }
    console.log("New user data :", newUser);
    setData((prevData) => [...prevData, newUser]);
    setTitle(" ");
    setDescription(" ");
  };
  return(
    <>
   <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"100px"}}>
      <Form onSubmit={handleAdd}>
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
          {/* <Input
            id="exampleDescription"
            name="description"
            placeholder="Enter Description"
            type="text"
            value={description}
       
            onChange={(e) => setDescription(e.target.value)}
            /> */}
             <YooptaEditor
        editor={editor}
        plugins={plugins}
        placeholder="Type something..."
        value={value}
        onChange={onChange}
        marks={MARKS}
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
            Submit
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
    </>
  )
};
export default AddForm ;