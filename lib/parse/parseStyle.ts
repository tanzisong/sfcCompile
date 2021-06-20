import {Declaration, Rule, Stylesheet} from "css";
import cssParser from "css/lib/parse";

/**
 * parse css
 * */
function parseStyle(style: string) {
	const styleMap = new Map<string, Record<string, string>>();
	const parseStyle: Stylesheet = cssParser(style);
	console.info(style, parseStyle);
	const {stylesheet} = parseStyle;

	stylesheet?.rules.forEach((classBlock) => {
		const {type, declarations, selectors} = classBlock as Rule;
		if (type === "rule") {
			const style = declarations?.reduce((p: Declaration, c: Declaration) => {
				if(c.type === "declaration") {
					return {
						...p,
						[toHumpName(c.property!)]: c.value
					}
				}
				return p;
			}, {}) || {};

			selectors?.forEach(select => {
				if (select.indexOf('.') === 0) {
					// class选择器
					const className = select.slice(1);

					styleMap.set(className, {
						...(styleMap.get(className) || {}),
						...(style || {}) as Record<string, string>
					})
				}
			})
		}
	})

	return styleMap;
}

function toHumpName(name: string): string {
	if (!name) return name;

	return name.replace(/-(\w)/g, (_, $1) => $1.toUpperCase());
}

export { parseStyle }
