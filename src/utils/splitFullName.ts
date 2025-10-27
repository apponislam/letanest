export const splitFullName = (fullName: string) => {
    if (!fullName) return { firstName: "", lastName: "" };

    const parts = fullName.trim().split(" ");

    // If name contains "N/A", remove it
    const filteredParts = parts.filter((part) => part !== "N/A" && part !== "undefined");

    if (filteredParts.length === 0) return { firstName: "", lastName: "" };
    if (filteredParts.length === 1) return { firstName: filteredParts[0], lastName: "" };

    return {
        firstName: filteredParts[0],
        lastName: filteredParts.slice(1).join(" "),
    };
};
