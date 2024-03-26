const blocks: Array<any> = [];
const dateChoose = new Date();
var alreadyTimes: Array<any> = [];

export const logica = () => {
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i]?.dates_bloked_times.length; j++) {
      if (blocks[i]?.dates_bloked_times[j] === dateChoose) {
        for (let y = 0; y < blocks[i]?.blocked_times.length; y++) {
          alreadyTimes.push(blocks[i]?.blocked_times[y]);
        }
        break;
      }
    }
  }
};
