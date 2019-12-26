const { traffic } = require('../dist/sim4me');

const phoneNumber = '09012345678';

(async () => {
  try {
    const result = await traffic({
      phone: phoneNumber,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
})();
