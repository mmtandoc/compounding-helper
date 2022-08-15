import React, {
  ComponentType,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import debounce from "lodash/debounce"
import { AutocompleteProps } from "./AutocompleteInput"

// Based on https://github.com/ericgio/react-bootstrap-typeahead

interface Props<T> extends AutocompleteProps<T> {
  delay?: number
  isLoading: boolean
  onSearch: (query: string) => void
  useCache?: boolean
}

const useForceUpdate = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState(0) // integer state
  return () => setValue((value) => value + 1) // update the state to force render
}

interface DebouncedFunction extends Function {
  cancel(): void
}

const useAsync = <T,>(props: Props<T>): Partial<AutocompleteProps<T>> => {
  const {
    delay = 10,
    isLoading,
    onSearch,
    onQueryChange,
    minLength = 2,
    useCache = false,
    ...otherProps
  } = props

  const handleSearchDebouncedRef = useRef<DebouncedFunction | null>(null)
  const queryRef = useRef<string>(otherProps.getItemValue(otherProps.item))

  const forceUpdate = useForceUpdate()

  const handleSearch = useCallback(
    (query: string) => {
      queryRef.current = query

      if (!query || (minLength && query.length < minLength)) {
        onSearch("")
        return
      }

      // Use cached results, if applicable.
      /*if (useCache && cacheRef.current[query]) {
        // Re-render the component with the cached results.
        forceUpdate();
        return;
      }*/

      // Perform the search.
      onSearch(query)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [forceUpdate, minLength, onSearch, useCache],
  )

  useEffect(() => {
    handleSearchDebouncedRef.current = debounce(handleSearch, delay)
    return () => {
      handleSearchDebouncedRef.current &&
        handleSearchDebouncedRef.current.cancel()
    }
  }, [delay, handleSearch])

  const handleQueryChange = useCallback(
    //(query: string, e: ChangeEvent<HTMLInputElement>) => {
    (query: string) => {
      onQueryChange && onQueryChange(query)

      handleSearchDebouncedRef.current &&
        handleSearchDebouncedRef.current(query)
    },
    [onQueryChange],
  )

  return { ...otherProps, onQueryChange: handleQueryChange }
}

const getDisplayName = <T,>(Component: ComponentType<T>): string => {
  return Component.displayName || Component.name || "Component"
}

function withAsync<T, P extends Props<T> = Props<T>>(
  Component: React.ComponentType<P>,
) {
  const AsyncAutocomplete = forwardRef<React.Component, P>((props, ref) => (
    <Component {...props} {...useAsync<T>(props)} ref={ref} />
  ))

  AsyncAutocomplete.displayName = `withAsync(${getDisplayName(Component)})`

  return AsyncAutocomplete
}

export default withAsync
