export function splitFullName(fullName?: string) {
    const name = fullName?.trim() || "";
    let firstName = "N/A";
    let lastName = "N/A";

    if (name) {
        const parts = name.split(" ").filter(Boolean);
        if (parts.length === 1) {
            firstName = parts[0];
        } else if (parts.length > 1) {
            lastName = parts[parts.length - 1];
            firstName = parts.slice(0, parts.length - 1).join(" ");
        }
    }

    return { firstName, lastName };
}
