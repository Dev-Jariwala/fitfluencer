// get the initials of the name
export const getInitials = (name = '') => {
    return name?.split('-')?.[1]?.split(' ')?.map(n => n[0])?.join('') || '-'
};

// get unique color from the list of colors by number
export const getUniqueColor = (number = 0) => {
    const colors = [
        "#e6194b", // Red
        "#3cb44b", // Green
        "#ffe119", // Yellow
        "#0082c8", // Blue
        "#f58231", // Orange
        "#911eb4", // Purple
        "#46f0f0", // Cyan
        "#f032e6", // Magenta
        "#d2f53c", // Lime
        "#fabebe", // Pink
        "#008080", // Teal
        "#e6beff", // Lavender
        "#aa6e28", // Brown
        "#fffac8", // Light Yellow
        "#800000", // Maroon
        "#aaffc3", // Mint
        "#808000", // Olive
        "#ffd8b1", // Apricot
        "#000075", // Navy
        "#808080", // Gray
    ];

    return colors[number % colors.length];
};

export const getUserSrNo = (username = '') => {
    return username?.split('-')?.[0] || 0;
};

