package com.oracle.devops.japp.japp;

import java.util.Objects;

public class VersionDAO {
    private String version;
    private String name;
    private String id;

    public VersionDAO(String version, String name, String id) {
        this.version = version;
        this.name = name;
        this.id = id;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VersionDAO that = (VersionDAO) o;
        return Objects.equals(version, that.version) && Objects.equals(name, that.name) && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(version, name, id);
    }
}
