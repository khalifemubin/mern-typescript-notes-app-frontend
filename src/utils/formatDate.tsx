export function formatDate(dateString:string):string{
    return new Date(dateString).toLocaleDateString("en-IN",
    {
        year:"numeric",
        month:"short",
        day:"numeric",
        hour:"2-digit",
        minute:"2-digit",
        second:"numeric"
    });
}