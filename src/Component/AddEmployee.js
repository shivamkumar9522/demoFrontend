import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, FormGroup, Input, Label, Button } from "reactstrap";
import YooptaEditor, { createYooptaEditor } from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import ActionMenu, { DefaultActionMenuRender } from "@yoopta/action-menu-list";
import Image from "@yoopta/image";
import Table from "@yoopta/table";
import Code from "@yoopta/code";
import Embed from "@yoopta/embed";
import Video from "@yoopta/video";
import File from "@yoopta/file";
import AccordionPlugin from "@yoopta/accordion";

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
import Callout from "@yoopta/callout";

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

const plugins = [
  Paragraph,
  Blockquote,
  NumberedList,
  BulletedList,
  TodoList,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Callout,
  Image,
  Table,
  Code,
  Embed,
  Video,
  File,
  AccordionPlugin,
];

const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};

const AddForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [title, setTitle] = useState(" ");
  const [description, setDescription] = useState(" ");
  const [error, setError] = useState("");
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState();
  const editorRef = useRef(null);
  const actionMenuRef = useRef(null);
  const onChange = (valuesss) => {
    console.log(valuesss, "valllu");

    setValue(valuesss);
  };

  const convertToHTML = (content) => {
    if (!content || typeof content !== "object") return "";

    return Object.values(content)
      .map((block) => {
        const { type, value } = block;
        let htmlContent = "";

        value.forEach((item) => {
          const childrenHTML = item.children
            .map((child) => {
              let text = child.text || "";

              if (child.bold) text = `<b>${text}</b>`;
              if (child.italic) text = `<i>${text}</i>`;
              if (child.underline) text = `<u>${text}</u>`;
              if (child.strike) text = `<s>${text}</s>`;
              if (child.code) text = `<code>${text}</code>`;
              if (child.highlight) {
                text = `<span style="background-color: ${child.highlight.color};">${text}</span>`;
              }
              if (child.highlight) {
                text = `<span style="color: ${child.highlight.color};">${text}</span>`;
              }
              return text;
            })
            .join("");

          if (type === "Paragraph") {
            htmlContent += `<p>${childrenHTML}</p>`;
          } else if (type === "HeadingOne") {
            htmlContent += `<h1>${childrenHTML}</h1>`;
          } else if (type === "HeadingTwo") {
            htmlContent += `<h2>${childrenHTML}</h2>`;
          } else if (type === "HeadingThree") {
            htmlContent += `<h3>${childrenHTML}</h3>`;
          } else if (type === "TodoList") {
            htmlContent += `<li>${childrenHTML}</li>`;
          } else if (type === "NumberedList") {
            htmlContent += `<ol><li>${childrenHTML}</li></ol>`;
          } else if (type === "BulletedList") {
            htmlContent += `<ul><li>${childrenHTML}</li></ul>`;
          } else if (type === "Blockquote") {
            htmlContent += `<Blockquote>${childrenHTML}</Blockquote>`;
          }
        });

        return htmlContent;
      })
      .join("<br>");
  };

 

  useEffect(() => {
    const editorInstance = editorRef.current;

    if (editorInstance) {
      editorInstance.on("selectionchange", () => {
        const selection = window.getSelection();
        const isTextSelected = selection && selection.toString().length > 0;

        if (isTextSelected) {
          actionMenuRef.current && actionMenuRef.current.show();
        } else {
          actionMenuRef.current && actionMenuRef.current.hide();
        }
      });
    }
  }, [editor]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !value) {
      setError("please fill all fields");
      return;
    }
    console.log(e, "addd");

    setError("");
    const formattedDescription = convertToHTML(value);
    console.log("HTML Output:", formattedDescription);

    const newUser = {
      title: title,
      description: formattedDescription,
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

    setData((prevData) => [...prevData, newUser]);
    setTitle(" ");
    setDescription(" ");
    setValue("");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <Form onSubmit={handleAdd}>
          <Row>
            <Col>
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
            <Col>
              <FormGroup>
                <Label for="exampleDescription">Description</Label>
                <YooptaEditor
                  editor={editor}
                  plugins={plugins}
                  placeholder="Type something..."
                  value={value}
                  onChange={onChange}
                  marks={MARKS}
                  tools={TOOLS}
                  ref={editorRef}
                />

                <ActionMenu
                  ref={actionMenuRef}
                  position="absolute"
                  style={{ display: "none" }}
                />
              </FormGroup>
            </Col>
          </Row>
          <div>
            <h4>Preview:</h4>
            <div
              dangerouslySetInnerHTML={{ __html: convertToHTML(value) }}
              style={{ whiteSpace: "pre-wrap" }} 
            />
          </div>
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
  );
};

export default AddForm;
