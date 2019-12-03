import TWEEN from 'tween.js';


const animate = () => {
  const update = TWEEN.update();
  requestAnimationFrame(animate);
};

module.exports = (ctx) => {
  // Wait for the context to initialize
  ctx.onInitialize(() => {
    animate();

    // Inject the animation
    ctx.update({
       animate: (key, value, time) => {
          let _tween = { value : ctx.data()[key] };
          new TWEEN.Tween(_tween)
            .to({value: value}, time === undefined ? 750 : time)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
              const updated = {};
              updated[key] = _tween.value;
              ctx.update(updated);
            }).start();
       }
    })
  })
}
