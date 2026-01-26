import PropTypes from "prop-types";

import ProductGridTwo from "./ProductGridTwo";
import SectionTitleTwo from "../../components/section-title/SectionTitleTwo";
import { Card ,Button, Row, Col} from "react-bootstrap";


const NewProductGrid = ({ category, limit }) => {
  return (
    <div className="product-area pb-60 section-padding-1">
      <div className="container-fluid">
        <h1>Treading</h1>
      <Row>
      {/* Card 1 */}
      <Col md={3}>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src="path-to-image1" alt="Men's Brown Oversized Shirt" />
          <Card.Body>
            <Card.Title>Men's Brown Oversized Shirt</Card.Title>
            <Card.Text>
              Shirt
              <br />
              ₹ 899
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      
      {/* Card 2 */}
      <Col md={3}>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src="path-to-image2" alt="Men's Black T-Shirt" />
          <Card.Body>
            <Card.Title>Men's Black T-Shirt</Card.Title>
            <Card.Text>
              T-Shirt
              <br />
              ₹ 699
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* Card 3 */}
      <Col md={3}>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src="path-to-image3" alt="Men's White Hoodie" />
          <Card.Body>
            <Card.Title>Men's White Hoodie</Card.Title>
            <Card.Text>
              Hoodie
              <br />
              ₹ 1299
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* Card 4 */}
      <Col md={3}>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src="path-to-image4" alt="Men's Blue Denim Jacket" />
          <Card.Body>
            <Card.Title>Men's Blue Denim Jacket</Card.Title>
            <Card.Text>
              Jacket
              <br />
              ₹ 1599
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
        {/* <SectionTitleTwo
          titleText="New Arrival"
          positionClass="text-center"
          spaceClass="mt-60"
        
        />
        <div className="row five-column">
          <ProductGridTwo
            category={category}
            type="new"
            limit={limit}
            spaceBottomClass="mb-25"
          />
        </div> */}

      </div>
    </div>
  );
};

NewProductGrid.propTypes = {
  category: PropTypes.string,
  limit: PropTypes.number
};

export default NewProductGrid;
