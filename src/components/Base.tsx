import Html from '@kitajs/html';

const Base = ({ children }: Html.PropsWithChildren) => {
    return (
        <>
            {'<!doctype html>'}
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <title>BETH</title>
                    <script
                        src="https://unpkg.com/htmx.org@1.9.5"
                        integrity="sha384-xcuj3WpfgjlKF+FXhSQFQ0ZNr39ln+hwjN3npfM9VBnUskLolQAcN80McRIVOPuO"
                        crossorigin="anonymous"
                    ></script>
                    <link href="/styles.css" rel="stylesheet" />
                </head>
                <body>${children}</body>
            </html>
        </>
    );
};

export default Base;
