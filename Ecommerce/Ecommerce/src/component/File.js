import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Badge
} from 'reactstrap';

function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);
    const [posts, setPosts] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const getPosts = async () => {
        await fetch('https://dummyjson.com/products')
            .then((res) => res.json())
            .then((res) => {
                if (res) {
                    console.log(res);
                    setPosts(res);
                }
            })
            .catch((err) => console.log(err));
    };

    const addToCart = (itemName, itemPrice) => {
        const newItemIndex = cartItems.findIndex((item) => item.name === itemName);
        if (newItemIndex !== -1) {
           
            cartItems[newItemIndex].quantity++;
            setCartItems([...cartItems]);
        } else {
            
            setCartItems([...cartItems, { name: itemName, quantity: 1, price: itemPrice }]);
        }
    };

    const removeFromCart = (itemName) => {
        const confirmation = window.confirm(`Are you sure you want to remove ${itemName} from the cart?`);
        if (confirmation) {
            const updatedCart = cartItems.filter((item) => item.name !== itemName);
            setCartItems(updatedCart);
        }
    };

    const getTotalUniqueItemsCount = () => {
       
        return cartItems.length;
    };

    const grandTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <Container>
            <h2 className="text-center text-dark fw-bold">MY ITEMS</h2>
            <div className="d-flex justify-content-end mt-3">
                <Button color="success" className='mb-4' onClick={toggleCart}>
                    View Cart{' '}
                    {cartItems.length > 0 && (
                        <Badge color="danger">
                            {getTotalUniqueItemsCount()} 
                        </Badge>
                    )}
                </Button>
            </div>

            <Row>
                {posts?.products?.map((post) => (
                    <Col md="4" key={post.id}>
                        <Card className='bg-info' style={{ width: '20rem', height: '27rem', margin: '0 10px 20px 10px' }}>
                            <CardBody>
                                <img src={post.thumbnail} alt='ecommerce' style={{ width: '100%', height: '10rem' }} />
                                <CardText>{post.title}</CardText>
                                <CardText>{post.description}</CardText>
                                <div>
                                    <span>Price:</span>
                                    <Badge color="danger">
                                        Rs {post.price}
                                    </Badge>
                                </div>
                                <CardText>{post.discountPercentage}</CardText>

                                <Button color="success" onClick={() => addToCart(post.title, post.price)}>
                                    Add to Cart
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal isOpen={isCartOpen} toggle={toggleCart} centered>
                <ModalHeader toggle={toggleCart}>Shopping Cart</ModalHeader>
                <ModalBody>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.name}>
                                    <td>{item.name}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newQuantity = parseInt(e.target.value, 10);
                                                if (!isNaN(newQuantity) && newQuantity >= 0) {
                                                    const updatedCart = cartItems.map((cartItem) =>
                                                        cartItem.name === item.name
                                                            ? { ...cartItem, quantity: newQuantity }
                                                            : cartItem
                                                    );
                                                    setCartItems(updatedCart);
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>Rs {item.price * item.quantity}</td>
                                    <td>
                                        <Button color="warning" onClick={() => removeFromCart(item.name)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="text-end">Grand Total: Rs {grandTotal}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="dark" onClick={toggleCart}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}

export default ShoppingCart;
