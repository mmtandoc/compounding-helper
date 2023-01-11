/*
Portions of this code is based on "react-bootstrap-typeahead" (https://github.com/ericgio/react-bootstrap-typeahead)

The MIT License (MIT)

Copyright (c) 2015–present Eric Giovanola

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import debounce from "lodash/debounce"
import React, {
  ComponentType,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { AutocompleteProps } from "./AutocompleteInput"

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
