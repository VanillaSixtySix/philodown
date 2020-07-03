# PhiloDown

PhiloDown is a content downloader for [Philomena]-based websites.

## Usage

Download and install either the LTS or current release of [Node.js].

Clone the repository to any location-- output location is configurable.

Run `npm install` and `npm install -D` in the `philodown` directory.

Launch the script with `npm start -- [...]`. Use `--help` to see further usage.

## Progress

- [ ] Static downloader
    - [ ] Filter by search input
    - [ ] Download [data dumps]
- [ ] Live downloader
    - [ ] Filter by search input
    - [x] Events
        - [x] `comment:create`
            - [x] Save comment metadata
        - [x] `image:create`
            - [x] Save image metadata
        - [x] `image:description_update`
        - [x] `image:update`
            - [x] Save image metadata
        - [x] `image:tag_update`
        - [x] `image:process`
            - [x] Save image metadata
            - [x] Save full representation of image

## Contributing

Contributions are welcome through issue submissions; pull requests are not at this time.

[philomena]: https://github.com/derpibooru/philomena
[Node.js]: https://nodejs.org/
[data dumps]: https://derpibooru.org/pages/data_dumps
