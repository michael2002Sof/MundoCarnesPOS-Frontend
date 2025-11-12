export default function  handleInputChange  (setState, field, value)  {
    setState((prev) => ({ ...prev, [field]: value }))
}
