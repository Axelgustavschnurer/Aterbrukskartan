import React from "react";

export default function addNewPost() {
    return (
        <>
            <div className="header" id="header">
                <img src="/images/stuns_logo.png" alt="logo" />
            </div>
            <div className="addNewPost">
                <div className="addNewPostContainer">
                    <div className="addNewPostTitle">
                        <h1>Add New Post</h1>
                    </div>
                    <div className="addNewPostForm">
                        <form>
                            <div className="addNewPostFormTitle">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" name="title" />
                            </div>
                            <div className="addNewPostFormDescription">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" name="description" rows={4} cols={50} />
                            </div>
                            <div className="addNewPostFormImage">
                                <label htmlFor="image">Image</label>
                                <input type="file" id="image" name="image" />
                            </div>
                            <div className="addNewPostFormLocation">
                                <label htmlFor="location">Location</label>
                                <input type="text" id="location" name="location" />
                            </div>
                            <div className="addNewPostFormSubmit">
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}