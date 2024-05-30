import { app } from '.'

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`)
})
