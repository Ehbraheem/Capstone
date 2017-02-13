require 'rails_helper'
# TODO: DRY-out test

RSpec.describe "ApiDevelopments", type: :request do

  def parsed_body
    JSON.parse response.body
  end

  describe "RDBMS-backed" do
    before(:each) { City.delete_all }
    after(:each) { City.delete_all }
    it "create RDBMS-backed model" do
      object = City.create name: "test"
      expect(object).to_not be nil
      expect(object).to respond_to(:name, :name=)
      expect(object).to be_kind_of City
      expect(object).to be_an_instance_of City
      expect(City.find(object.id).name).to eq "test"
    end
    it "expose RDBMS-backed API resource" do
      object = City.create name: "test"
      expect(cities_path).to eq "/api/cities"
      get city_path(object.id)
      expect(response).to have_http_status :ok
      expect(parsed_body["name"]).to eq "test"
    end
  end

  describe "MongoDB-backed" do
    before(:each) { State.delete_all }
    after(:each) { State.delete_all }
    it "create MongoDB-backed model" do
      object = State.create name: "test"
      expect(object).to_not be nil
      expect(object).to respond_to(:name, :name=)
      expect(object).to be_kind_of State
      expect(object).to be_an_instance_of State
      expect(State.find(object.id).name).to eq "test"
    end
    it "expose MongoDB-backed API resource" do
      object = State.create name: "test"
      expect(states_path).to eq "/api/states"
      get state_path(object.id)
      expect(response).to have_http_status :ok
      expect(parsed_body["name"]).to eq "test"
      expect(parsed_body).to include("created_at")
      # byebug
      expect(parsed_body).to include("id" => object.id.to_s)
    end
  end

  # # TODO: Fix this test
  # describe "Allow only GET requests" do
  #
  #   it "on RDBMS-backed resources" do
  #     object = City.create name: "test"
  #     # byebug
  #     put city_path(object), {city: {name: "test1"}}
  #     # post cities_path, {city: {name: "test"}}
  #     expect(response).to have_http_status :no_content
  #   end
  # end

end
