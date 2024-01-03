import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function PostEditForm() {
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    content: "",
    image: "",
  });
  const { content, image } = postData;

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        const { content, image, is_owner } = data;

        is_owner ? setPostData({ content, image }) : history.push("/");
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [history, id]);

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("content", content);

    if (imageInput?.current?.files[0]) {
        formData.append("image", imageInput.current.files[0]);
      }

      try {
        await axiosReq.put(`/posts/${id}/`, formData);
        history.push(`/posts/${id}`);
      } catch (err) {
        // console.log(err);
        if (err.response?.status !== 401) {
          setErrors(err.response?.data);
        }
      }
    };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label className="d-none">Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          placeholder="Write a caption..."
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button}`}
        onClick={() => history.goBack()}
      ><i className="fa-solid fa-xmark"></i> Cancel</Button>
      <Button className={`${btnStyles.Button}`} type="submit">
      <i className="fa-solid fa-circle-plus"></i>Save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Container
            className={`${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
                  <figure>
                    <Image
                        className={appStyles.Image}
                        src={image}
                        rounded
                    />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                      </Form.Label>
                  </div>
              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
                className={styles.hiddenInputButton}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Container>
        </Col>
          <Container className={appStyles.Content}>{textFields}</Container>
      </Row>
    </Form>
  );
}

export default PostEditForm;