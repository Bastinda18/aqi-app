const createAutoComplete = ({
	root,
	renderOption,
	onOptionSelect,
	inputValue,
	fetchData,
	searchObj
}) => {
	root.innerHTML = `
  <label><b>Choose ${searchObj}</b></label>
  <input class = "input"/>
  <div class = "dropdown">
    <div class = "dropdown-menu" >
        <div class = "dropdown-content results">
        </div>
    </div>
  </div>
  <img src="city.png"/>

`;
	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	const onInput = async (event) => {
		const allitems = await fetchData(event.target.value);
		//got the Array
		const inputValueWord = event.target.value;
		if (inputValueWord === '') {
			dropdown.classList.remove('is-active');
			return;
		}
		if (!(inputValueWord === '')) {
			const allOptions = resultsWrapper.querySelectorAll('a');
			for (let option of allOptions) {
				option.remove();
			}
		}
		function capitalize(inputValueWord) {
			console.log(inputValueWord);
			return inputValueWord[0].toUpperCase() + inputValueWord.slice(1);
		}
		function compare(value) {
			const item = inputValue(value);
			return item.includes(capitalize(inputValueWord));
		}

		const items = allitems.filter(compare);

		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}

		resultsWrapper.innerHTML = '';
		dropdown.classList.add('is-active');
		for (let item of items) {
			const option = document.createElement('a');

			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(item);
			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				input.value = '';
				onOptionSelect(item);
			});
			resultsWrapper.appendChild(option);
		}
	};
	input.addEventListener('input', debounce(onInput, 500));
	document.addEventListener('click', (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove('is-active');
		}
	});
};
