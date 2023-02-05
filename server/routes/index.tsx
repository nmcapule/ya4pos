/** Just redirect to /sandbox. */
export const handler = (_req: Request) => {
    const headers = new Headers();
    headers.set("location", "/sandbox");
    return new Response(null, { status: 303, headers });
};
