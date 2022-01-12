export default <T>(array: T[], max: number): T[][] => {
    const a = [...array];
    const results: T[][] = [];
    while (a.length) {
        results.push(a.splice(0, max));
    }
    return results;
};
