import express from "express";

export const getSomeData = (req:express.Request, res:express.Response) => {
     res.send(JSON.stringify({
         age:5,
         name: "testName"
     }))
}

export const SomeData = (req:express.Request, res:express.Response) => {
    res.json({
        age:5,
        name: "testName"
    })
}