import { onMounted, onUnmounted, reactive } from "vue";

export default function () {
  let point = reactive({
    x: 0,
    y: 0,
  });

  function updatePoint(event) {
    point.x = event.pageX;
    point.y = event.pageY;
  }

  onMounted(() => {
    window.addEventListener("click", updatePoint);
  });

  onUnmounted(() => {
		window.removeEventListener("click" , updatePoint)
	});

	return point
}
